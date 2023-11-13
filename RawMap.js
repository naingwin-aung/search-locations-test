var map;
        function initMap() {
            map = new google.maps.Map(document.getElementById('dining-map'),
        {
            zoom: <?php echo $zoom; ?>,
            center: new google.maps.LatLng(<?php echo $merchant_metas[$center_no]['latitude']; ?>, <?php echo $merchant_metas[$center_no]['longitude']; ?>),
            mapTypeId: 'roadmap'
        } );
        var iconBase = '<?php echo ASSET_URL . '/images/'; ?>';
        var icons = {
            info: {
                icon: iconBase + 'map.png'
            }
        };
        var features = [
            <?php $total = count($merchant_metas); $count=0; ?>
            <?php
                foreach( $merchant_metas as $meta ):
                if(empty($meta['latitude']) || empty($meta['longitude']) ){
                    continue;
                }
            ?>
            {
                position: new google.maps.LatLng(<?php echo $meta['latitude']; ?>, <?php echo $meta['longitude']; ?>),
                type: 'info',
                title: "<?php echo $meta['branch_name']; ?>",
                postID: '<?php echo $meta['post_id']; ?>',
                address: <?php echo json_encode(strip_tags($meta['branch_address'])); ?>,
                phone: <?php echo json_encode(strip_tags($meta['branch_phone'])); ?>
            }<?php echo ($count != ($total-1) ) ? ',' : ''; ?><?php $count++; endforeach; ?>];
        // Set up info window
        var infowindow = new google.maps.InfoWindow();
        // Create markers.
        features.forEach(function(feature) {
            var marker = new google.maps.Marker({
                position: feature.position,
                animation: google.maps.Animation.DROP,
                icon: icons[feature.type].icon,
                map: map,
                title: feature.title
            });
            var contentString = '<div id="branch-' + feature.postID  + '" class="branch-info">'+
                                '<h2>' + feature.title + '</h2>'+
                                '<p class="address">' + feature.address + '</p>'+
                                '<p class="phone"> Tel: ' + feature.phone + '</p>'+
                                '</div>';
            marker.addListener('click', function() {
                infowindow.setContent(contentString);
                infowindow.open(map, marker);
            });
        });
    };
    </script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC44n4EJxputPRoWzorOaszqW-dFoVN8UE&callback=initMap" async defer></script>