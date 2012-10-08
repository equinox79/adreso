package Adreso::Pages;
use strict;
use warnings;
use Data::Printer;
use Data::Dumper;
use Encode;
use WebService::Simple;
use URI::Escape;
use JSON;
use utf8;

sub index {
    my ( $req, $params ) = @_;
    my $page  = {
        template => 'index.tx',
        title    => 'adre.so',
    };

    my $query = &query_parse($params->{q});

    # 住所の時は正規化APIを叩く
    if ( $query->{type} eq 'addr' ) {
        #$page->{addr_normalized} = &addr_normalize( $query->{parts}[0] );
        $page->{addr_normalized} = $query->{parts}[0];
    }
    elsif ( $query->{type} eq 'latlon' ) {

    }
    else {

    }

    return $page;
}

sub query_parse {
    my ($q) = @_;
    $q = &decode( 'utf8', $q );

    my $query_obj = { parts => [], type => undef, query_string => $q };
    if ( @{ $query_obj->{parts} } =
        $q =~ /^([-]?\d+(?:\.\d+)?),([-]?\d+(?:\.\d+)?)$/ )
    {
        $query_obj->{type} = 'latlon';
    }
    elsif ( @{ $query_obj->{parts} } = $q =~ /(.+)/ ) {
        $query_obj->{type} = 'addr';
    }

    return $query_obj;
}

sub addr_normalize {
    my ($addr_raw) = @_;
    my $addr_normalize = $addr_raw;

    my $normalize = WebService::Simple->new(
        base_url        => 'https://api.loctouch.com/v1/geo/address_normalize',
        response_parser => {
	    module => 'JSON',
	    args => {
	        json => JSON->new->utf8,
	    }
        },
    );

    eval {
        my $res = $normalize->get( { address => $addr_raw } );
        my $json = $res->parse_response;
        if ( $json && $json->{code} == 200 ) {
            $addr_normalize = $json->{result}->{address};
        }
    };
    if ($@) {
        p $@;
    }

    return $addr_normalize;
}

1
__END__
